"use client"

import { useState } from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { 
    Lock, 
    Zap, 
    CheckCircle2, 
    CreditCard, 
    Loader2, 
    AlertCircle 
} from "lucide-react"
import { motion } from "framer-motion"

interface UnlockModalProps {
    open: boolean
    onClose: () => void
    testId: string
    testType: "reading" | "listening"
}

export function UnlockModal({ open, onClose, testId, testType }: UnlockModalProps) {
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePurchase = async () => {
        try {
            setIsProcessing(true)
            // BU YERDA: Backend API orqali to'lov linkini olish kerak
            // Masalan: const res = await getPaymentLinkAPI(testId)
            
            console.log(`${testType} test (${testId}) uchun to'lov boshlandi...`)
            
            // Simulyatsiya (2 sekund kutish)
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // To'lov sahifasiga yo'naltirish (masalan Click yoki Payme)
            // window.location.href = res.payment_url 
            
            alert("To'lov tizimiga yo'naltirilmoqda...")
        } catch (error) {
            console.error("To'lovda xatolik:", error)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[420px] rounded-[32px] border-none p-0 overflow-hidden bg-white shadow-2xl">
                
                {/* 1. Gradient Header */}
                <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-8 text-white relative">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/30"
                    >
                        <Lock className="text-white fill-white/20" size={32} />
                    </motion.div>
                    <DialogTitle className="text-2xl font-black tracking-tight mb-2">
                        Premium Testni Ochish
                    </DialogTitle>
                    <DialogDescription className="text-indigo-100 text-sm font-medium leading-relaxed">
                        Ushbu test premium hisoblanadi. To'liq kirish huquqini olish uchun ushbu modulni sotib oling.
                    </DialogDescription>
                    
                    {/* Dekorativ element */}
                    <Zap className="absolute right-6 top-10 text-white/10" size={120} />
                </div>

                {/* 2. Features List */}
                <div className="p-8 space-y-5 bg-white">
                    <div className="space-y-4">
                        {[
                            "Barcha savollar va audio/matnlarga to'liq kirish",
                            "Batafsil natijalar va tahlillar",
                            "Ekspertlar tomonidan tayyorlangan tushuntirishlar",
                            "Sertifikat uchun ballarni hisoblash"
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                                <span className="text-slate-600 text-sm font-semibold">{item}</span>
                            </div>
                        ))}
                    </div>

                    {/* Price Tag */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Narxi:</p>
                            <p className="text-2xl font-black text-slate-900">15,000 UZS</p>
                        </div>
                        <Badge className="bg-blue-600 text-white border-none font-black text-[10px] px-3 py-1">
                            BIR MARTALIK
                        </Badge>
                    </div>

                    {/* Alert */}
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 italic text-[11px] font-medium">
                        <AlertCircle size={14} />
                        Sotib olingan testlar profilingizda doimiy qoladi.
                    </div>
                </div>

                {/* 3. Footer Buttons */}
                <DialogFooter className="p-8 pt-0 flex flex-col gap-3 sm:flex-col">
                    <Button 
                        onClick={handlePurchase}
                        disabled={isProcessing}
                        className="w-full h-14 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                    >
                        {isProcessing ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <CreditCard size={18} />
                                Hozir sotib olish
                            </div>
                        )}
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="w-full h-10 text-slate-400 font-bold hover:bg-slate-50 rounded-xl"
                    >
                        Bekor qilish
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
            {children}
        </span>
    )
}