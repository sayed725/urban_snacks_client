import SectionHeader from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, RefreshCcw, CheckCircle, AlertTriangle, Camera, Truck, Phone, Mail, FileText, Ban } from 'lucide-react';
import React from 'react';

const TermsConditionsPage = () => {
    return (
        <div className="container w-11/12 mx-auto px-4 py-10 md:py-10">
            <div className="text-center mb-16">
                <SectionHeader
                    badge="Guidelines"
                    title="Terms & Conditions"
                    description="Understanding our Refund and Exchange policies for a better experience"
                />
            </div>

            <div className="space-y-16">
                {/* 1. Refund Policy */}
                <section>
                    <div className="flex items-center gap-3 mb-8 border-b pb-4">
                        <RotateCcw className="text-orange-600" size={28} />
                        <h2 className="text-3xl font-black text-stone-800">1. Refund Policy</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-md bg-stone-50/50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                        <Ban size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2">Non-Delivery or Overpayment</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            If you do not receive your ordered product or if you have paid more than the actual price for any reason, we will refund the amount within <strong>7 working days</strong> of your order.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-stone-50/50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2">Stock-Out Situations</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            If a pre-paid item goes out of stock, you can choose an alternative product or request a full refund. Refunds will be processed within <strong>7 working days</strong>.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-stone-50/50 md:col-span-2">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-2">Missing or Incorrect Quantity</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            If your order is incomplete or you receive a smaller quantity than ordered, we will ship the missing items at <strong>our own delivery cost</strong>.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* 2. Exchange Policy */}
                <section>
                    <div className="flex items-center gap-3 mb-8 border-b pb-4">
                        <RefreshCcw className="text-orange-600" size={28} />
                        <h2 className="text-3xl font-black text-stone-800">2. Exchange Policy</h2>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <CheckCircle className="text-green-600" size={20} />
                                Eligibility Window
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Products are eligible for exchange within <strong>one week</strong> (7 days) of purchase for offline orders or receipt for online orders.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <h4 className="font-black text-amber-600 mt-1">01.</h4>
                                    <p className="text-muted-foreground">For online orders, provide the name and mobile number used. For offline orders, the purchase date is required.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <h4 className="font-black text-amber-600 mt-1">02.</h4>
                                    <p className="text-muted-foreground">Clearly state the reason for the exchange. If the product is defective, please provide photos or videos (for online orders) or bring it to our store.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <h4 className="font-black text-amber-600 mt-1">03.</h4>
                                    <p className="text-muted-foreground"><strong>Shipping Costs:</strong> If the product has a defect, we cover the exchange delivery charge. For personal preference changes, the customer bears the delivery cost.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <h4 className="font-black text-amber-600 mt-1">04.</h4>
                                    <p className="text-muted-foreground">Exchange adjustment: If you choose a new product, we will adjust the bill with your exchange item during the new delivery.</p>
                                </div>
                            </div>
                        </div>

                        <Card className="border-2 border-amber-200 bg-amber-50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl text-amber-600 shrink-0 shadow-sm">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black text-amber-900 mb-2">Important: Delivery Inspection</h4>
                                        <p className="text-amber-900/70 leading-relaxed text-sm">
                                            If you do not like a product at the time of delivery, <strong>DO NOT</strong> return it directly to the delivery person, as this risks product loss. Instead, receive the parcel by paying the bill, then inform us within 7 days. We will arrange an exchange and adjust the bill accordingly, InshaAllah.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Footer Section */}
                <section className="text-center pt-8 border-t">
                    <h2 className="text-2xl font-black mb-6">Need Help?</h2>
                    <p className="text-muted-foreground mb-8">
                        Our team is here to ensure your satisfaction. Contact us for any clarifications regarding these terms.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-3 bg-white shadow-sm border p-4 rounded-2xl">
                            <Phone className="text-amber-500" size={20} />
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase">Call Us</p>
                                <p className="font-bold">01627142598</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white shadow-sm border p-4 rounded-2xl">
                            <Mail className="text-amber-500" size={20} />
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold uppercase">Email Us</p>
                                <p className="font-bold">abusayedkhan.pro@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-12 text-sm text-stone-400 italic">
                        Last updated: April 12, 2026
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsConditionsPage;
