import axios from 'axios';

export default async function getDataAdmin(url: string) {
  const res = await axios.get(url, { timeout: 10000 });
  return res.data;
}
