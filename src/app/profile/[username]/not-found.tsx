import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserX } from 'lucide-react'

export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center px-4">
      <UserX className="w-20 h-20 text-destructive mb-6" />
      <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Sorry, this profile isn't available. The link may be broken, or the page may have been removed.
      </p>
      <Link href="/" passHref>
        <Button size="lg">
          Go Back to InstaFocus
        </Button>
      </Link>
    </div>
  )
}
