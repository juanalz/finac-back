import { Injectable } from "@nestjs/common";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

@Injectable()
export class PasswordHasherService {
  hash(password: string): string {
    const salt = randomBytes(16).toString("hex");
    return `${salt}:${this.digest(password, salt)}`;
  }

  verify(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;

    const expected = Buffer.from(hash, "hex");
    const actual = Buffer.from(this.digest(password, salt), "hex");

    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }

  private digest(password: string, salt: string): string {
    return scryptSync(password, salt, 64).toString("hex");
  }
}
