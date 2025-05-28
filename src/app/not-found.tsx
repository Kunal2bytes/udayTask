import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center px-4">
      <AlertTriangle className="w-20 h-20 text-destructive mb-6" />
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <Link href="/" passHref>
        <Button size="lg">
          Go Back Home
        </Button>
      </Link>
    </div>
  )
}
