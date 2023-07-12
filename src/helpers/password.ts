import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class PasswordHelper {
  static async toHash(password: string) {
    const salt: string = randomBytes(8).toString("hex");

    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    try {
      (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    } catch (err) {
      console.log(err, "err");
    }

    return buf.toString("hex") === hashedPassword;
  }
}
