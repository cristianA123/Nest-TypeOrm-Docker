import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  console.log(env);
  const fallback: string = resolve(`${dest}/example.env`);
  const filename: string = env ? `${env}.env` : 'example.env';
  const filePath: string = resolve(`${dest}/${filename}`);
  // console.log(filePath);
  // console.log(existsSync(filePath));
  // if (!existsSync(filePath)) filePath = fallback;
  //   console.log(filePath);
  return existsSync(filePath) ? filePath : fallback;
}
