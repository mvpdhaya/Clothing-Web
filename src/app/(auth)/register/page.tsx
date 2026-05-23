// Register page removed — Google OAuth handles both sign-in and sign-up.
// Redirect visitors to the login page.
import { redirect } from 'next/navigation';

export default function RegisterPage() {
  redirect('/login');
}
