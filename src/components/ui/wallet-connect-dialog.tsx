'use client'

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Lock, Wallet } from 'lucide-react'

interface WalletConnectDialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  showConnectButton?: boolean
  onConnect?: () => void
}

export const WalletConnectDialog = ({ isOpen, onClose, title = 'Connect Wallet Required', description = 'You need to connect your crypto wallet to access this feature.', showConnectButton = false, onConnect }: WalletConnectDialogProps) => {
  const handleConnect = () => {
    onConnect ? onConnect() : document.querySelector('appkit-button')?.click()
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Lock className="h-4 w-4 text-blue-600" />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
          {showConnectButton && (
            <AlertDialogAction asChild>
              <Button onClick={handleConnect}>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
