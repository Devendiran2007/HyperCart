import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowLeft, ArrowRight, ShieldCheck, Truck, CreditCard, ShoppingBag } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: (shippingAddress: string, paymentMethod: string) => void;
  totalAmount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmOrder,
  totalAmount
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('100 Infinity Loop, Cupertino, CA');
  const [apartment, setApartment] = useState('Apt 4B');
  const [paymentMethod, setPaymentMethod] = useState('Apple Pay');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [assignedOrderNumber, setAssignedOrderNumber] = useState('');

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handlePlaceOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderConfirmed(true);
      const generatedNum = `HC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      setAssignedOrderNumber(generatedNum);
      onConfirmOrder(`${address}, ${apartment}`, paymentMethod);
    }, 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="glass-panel w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-black/[0.04] flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Secure Checkout
              <ShieldCheck className="w-4 h-4 text-success" />
            </h3>
            {!orderConfirmed && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-black/5 text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress Bar Indicators */}
          {!orderConfirmed && (
            <div className="px-6 pt-4">
              <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: '33.33%' }}
                  animate={{
                    width: step === 1 ? '33.33%' : step === 2 ? '66.66%' : '100%'
                  }}
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-300"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-textSecondary uppercase tracking-widest">
                <span className={step >= 1 ? 'text-primary font-bold' : ''}>Address</span>
                <span className={step >= 2 ? 'text-primary font-bold' : ''}>Payment</span>
                <span className={step >= 3 ? 'text-primary font-bold' : ''}>Review</span>
              </div>
            </div>
          )}

          {/* Body Section */}
          <div className="p-6 min-h-[220px] flex flex-col justify-center bg-surface/10">
            {orderConfirmed ? (
              // Order Success Page
              <div className="text-center py-6 space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10, stiffness: 120 }}
                  className="w-16 h-16 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center border border-success/30"
                >
                  <Check className="w-8 h-8" />
                </motion.div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Order Placed Successfully!</h4>
                  <p className="text-xs text-textSecondary mt-1 leading-relaxed">
                    Your order has been transmitted. The vendor has begun packing.
                  </p>
                  <div className="mt-4 p-3 bg-black/5 rounded-xl border border-black/[0.04] w-fit mx-auto text-xs font-bold font-mono text-primary">
                    Order Ref: {assignedOrderNumber}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Track Order
                </button>
              </div>
            ) : (
              <div>
                {/* Step 1: Address */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-primary" /> Delivery Destination
                    </h4>
                    <div>
                      <label className="text-[10px] text-textSecondary uppercase block mb-1">Street Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-black/5 border border-black/[0.04] rounded-xl text-xs text-slate-800 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-textSecondary uppercase block mb-1">Apartment, Suite, Unit</label>
                      <input
                        type="text"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full px-3 py-2 bg-black/5 border border-black/[0.04] rounded-xl text-xs text-slate-800 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-primary" /> Select Payment Method
                    </h4>
                    {['Apple Pay', 'Credit / Debit Card', 'Cash on Delivery'].map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between border cursor-pointer transition-all ${
                          paymentMethod === method
                            ? 'bg-primary/10 border-primary text-slate-800 font-bold shadow-sm'
                            : 'bg-black/5 border-black/[0.04] hover:border-black/[0.08] text-textSecondary'
                        }`}
                      >
                        <span className="text-xs">{method}</span>
                        {paymentMethod === method && (
                          <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-primary" /> Review & Place Order
                    </h4>
                    <div className="glass-panel p-4 rounded-2xl space-y-2.5 text-xs text-textSecondary border border-black/[0.04]">
                      <div className="flex justify-between">
                        <span>Ship To</span>
                        <span className="text-slate-800 font-semibold text-right">{address}, {apartment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Method</span>
                        <span className="text-slate-800 font-semibold">{paymentMethod}</span>
                      </div>
                      <div className="w-full h-[1px] bg-black/[0.04] my-2" />
                      <div className="flex justify-between text-sm font-bold text-slate-800">
                        <span>Amount Due</span>
                        <span className="text-primary">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {!orderConfirmed && (
            <div className="p-6 border-t border-black/[0.04] flex items-center justify-between gap-3 bg-[#F4F5F7]">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-4 py-2.5 bg-black/5 hover:bg-black/10 text-slate-850 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer animate-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isOrdering}
                  className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  {isOrdering ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>Place Order ${totalAmount.toFixed(2)}</>
                  )}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
export default CheckoutModal;
