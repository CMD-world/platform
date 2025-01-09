import { type PrivyDbUser } from "$lib/privy";

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: PrivyDbUser | null;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
