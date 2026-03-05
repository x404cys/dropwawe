import { prisma } from '@/app/lib/db';
import { MerchantLoginResponse } from '@/types/api/merchant';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

export async function registerMerchantForUser(userId: string, username: string, password: string) {
  const hash = await bcrypt.hash(password, 10);
  return prisma.merchant.create({
    data: { userId, username, password: hash },
  });
}

export async function loginMerchant(username: string, password: string) {
  const merchant = await prisma.merchant.findUnique({ where: { username } });
  if (!merchant) throw new Error('Merchant not found');

  const isValid = await bcrypt.compare(password, merchant.password);
  if (!isValid) throw new Error('Invalid password');

  const form = new URLSearchParams({ username, password });

  const res = await fetch('https://api.alwaseet-iq.net/v1/merchant/login', {
    method: 'POST',
    body: form,
  });

  const data = (await res.json()) as MerchantLoginResponse;

  if (!data.status || !data.data?.token) throw new Error(data.msg || 'Login failed');

  const token = data.data.token;
  const tokenExp = new Date();
  tokenExp.setHours(tokenExp.getHours() + 24);

  await prisma.merchant.update({
    where: { id: merchant.id },
    data: { token, tokenExp },
  });

  return { token, tokenExp };
}

export async function getValidToken(username: string) {
  const merchant = await prisma.merchant.findUnique({ where: { username } });
  if (!merchant) throw new Error('Merchant not found');

  if (!merchant.token || !merchant.tokenExp || merchant.tokenExp < new Date()) {
    return (await loginMerchant(merchant.username, merchant.password)).token;
  }

  return merchant.token;
}
