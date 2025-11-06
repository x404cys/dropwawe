import axiosInstance from '@/app/axios/axiosInstance';

export default async function getDataAdmin(url: string) {
  const res = await axiosInstance.get(url);
  return res.data;
}
