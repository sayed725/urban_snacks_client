import SectionHeader from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Truck, Calendar, MapPin, Gift, AlertTriangle, RotateCcw, Phone, Mail, Clock, Zap } from 'lucide-react';
import React from 'react';

const ShippingPolicyPage = () => {
    return (
        <div className="container w-11/12 mx-auto px-4 py-10 md:py-10">
            <div className="text-center mb-16">
                <SectionHeader
                    badge="Delivery Info"
                    title="Shipping Policy"
                    description="How we handle your snacks' journey to your doorstep"
                />
            </div>

            <div className="mb-12 text-lg text-muted-foreground leading-relaxed">
                <p>
                    Thank you for choosing <strong>Urban Snacks</strong> as your snacks journey companion. This Shipping Policy informs you about the delivery rules and regulations for your ordered products. By placing an order through our e-commerce website, you agree to the following terms and conditions.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <Card className="border-none shadow-md bg-muted/40 dark:bg-card/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Processing Time</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Subject to stock availability, orders are generally prepared and handed over to our delivery partners within <strong>one to two working days</strong> of confirmation. This processing time begins once we confirm your order via a phone call.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-muted/40 dark:bg-card/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                                <Truck size={24} />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Delivery Partners</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            We use reliable third-party services like <strong>Pathao Courier</strong> and <strong>Sundarban Courier</strong>. Delivery across Bangladesh typically takes between <strong>1 to 4 days</strong> after confirmation.
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                            *For Sundarban Courier, customers may need to collect parcels from their respective branch offices.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-12">
                <section className="bg-orange-50/50 dark:bg-orange-900/10 p-8 rounded-3xl border border-orange-100 dark:border-orange-900/20">
                    <div className="flex items-center gap-3 mb-6">
                        <Zap className="text-orange-600 dark:text-orange-400" size={24} />
                        <h2 className="text-2xl font-extrabold tracking-tight text-orange-900 dark:text-orange-200">Urgent Same-Day Delivery</h2>
                    </div>
                    <div className="text-orange-900/80 dark:text-orange-200/70 space-y-4 font-medium">
                        <p>
                            We offer urgent same-day delivery services for <strong>Dhaka and Chattogram</strong> cities. This service is managed manually:
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Process: Orders must be placed/confirmed manually.</li>
                            <li>Payment: The total order value must be paid in advance via <strong>bKash, Rocket, or Nagad</strong>.</li>
                            <li>Charges: The customer will pay the urgent delivery fee directly to the rider at the time of delivery (fees depend on distance as calculated by Pathao or the booking app).</li>
                        </ul>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b pb-2">
                            <MapPin className="text-amber-600 dark:text-amber-400" size={24} />
                            <h2 className="text-2xl font-extrabold tracking-tight">Address Accuracy</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Providing an accurate and complete delivery address is the customer's responsibility. <strong>Urban Snacks</strong> will not be held liable for delivery failures or misdeliveries resulting from incorrect address or contact details provided by the customer.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b pb-2">
                            <Gift className="text-amber-600 dark:text-amber-400" size={24} />
                            <h2 className="text-2xl font-extrabold tracking-tight">Gifts & Third-Party Pickup</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            If you are sending a gift or someone else is receiving the order, please inform the recipient in advance. If the person receiving the parcel does not confirm the order during our verification call, the order will be marked as cancelled.
                        </p>
                    </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b pb-2">
                            <AlertTriangle className="text-amber-600 dark:text-amber-400" size={24} />
                            <h2 className="text-2xl font-extrabold tracking-tight">Potential Delays</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            While we strive for speed, delays may occur due to unavoidable circumstances such as extreme weather, courier service issues, political events, or other unforeseen incidents. We appreciate your patience and cooperation in such cases.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b pb-2">
                            <RotateCcw className="text-amber-600 dark:text-amber-400" size={24} />
                            <h2 className="text-2xl font-extrabold tracking-tight">Returns & Redelivery</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            If a parcel is returned due to an incorrect address or the customer being unavailable for 3 consecutive delivery attempts, the customer will be responsible for both the initial shipping fee and the return shipping charges.
                        </p>
                    </section>
                </div>

                <section className="text-center pt-8 border-t">
                    <h2 className="text-2xl font-extrabold tracking-tight mb-6">Contact Us</h2>
                    <p className="text-muted-foreground mb-8">
                        If you have any questions or concerns regarding your shipment, please feel free to reach out to us:
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-3 bg-card shadow-sm border p-4 rounded-2xl">
                            <Phone className="text-amber-600 dark:text-amber-400" size={20} />
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold text-start uppercase tracking-wider">Call Us</p>
                                <p className="font-bold">01627142598</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-card shadow-sm border p-4 rounded-2xl">
                            <Mail className="text-amber-600 dark:text-amber-400" size={20} />
                            <div>
                                <p className="text-xs text-muted-foreground font-semibold text-start uppercase tracking-wider">Email Us</p>
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

export default ShippingPolicyPage;
