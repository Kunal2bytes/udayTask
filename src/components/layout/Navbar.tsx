import Link from 'next/link';
import { Home, PlusSquare, UserCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between max-w-screen-lg mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Camera className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-foreground">InstaFocus</span>
        </Link>
        <nav className="flex items-center space-x-2">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" aria-label="Home">
              <Home className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="/create" passHref>
            <Button variant="ghost" size="icon" aria-label="Create Post">
              <PlusSquare className="h-6 w-6" />
            </Button>
          </Link>
          <Link href="/profile/CoolPhotographer" passHref> {/* TODO: Make dynamic to current user */}
            <Button variant="ghost" size="icon" aria-label="Profile">
              <UserCircle className="h-6 w-6" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
