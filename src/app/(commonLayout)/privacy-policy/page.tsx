import SectionHeader from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Mail, Phone, Clock, UserCheck, Share2, MousePointer2, FileEdit, Eye, Lock } from 'lucide-react';
import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="container w-11/12 mx-auto px-4 py-10 md:py-10">
            <div className="text-center mb-16">
                <SectionHeader
                    badge="Privacy First"
                    title="Privacy Policy"
                    description="How we collect, use, and protect your personal information"
                />
            </div>

            <div className="mb-12 text-lg text-muted-foreground leading-relaxed">
                <p>
                    This Privacy Policy explains how we, <strong>Urban Snacks</strong>, collect, use, and store your (the customer's) information through our <strong>UrbanSnacks.com</strong> e-commerce website. We are committed to protecting your privacy and ensuring your personal data is handled securely and responsibly.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <Card className="border-none shadow-md bg-muted/40 dark:bg-card/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                                <UserCheck size={24} />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">Information We Collect</h3>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-1">•</span>
                                <div><strong>Contact details:</strong> Email address, shipping address, and phone number.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-1">•</span>
                                <div><strong>Payment details:</strong> Information required to process your transactions securely.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-500 mt-1">•</span>
                                <div><strong>Preferences:</strong> Your shopping interests and items of interest.</div>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-muted/40 dark:bg-card/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-xl font-bold tracking-tight">When We Collect</h3>
                        </div>
                        <p className="text-muted-foreground mb-4">We collect your information only during the following interactions:</p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                <span>When you make a purchase from our site.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                <span>When you create an account on our platform.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                <span>When you subscribe to our newsletter.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                <span>When you contact our customer support.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-amber-500">•</span>
                                <span>Through cookies and similar technologies.</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-6 border-b pb-2">
                        <MousePointer2 className="text-orange-500 dark:text-orange-400" size={24} />
                        <h2 className="text-2xl font-extrabold tracking-tight">How We Use Your Information</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Order Processing", desc: "To process your orders, payments, and delivery efficiently." },
                            { title: "Shopping Experience", desc: "To enhance and personalize your shopping journey on our site." },
                            { title: "Service Improvements", desc: "To continuously improve our products and customer services." },
                            { title: "Marketing", desc: "To inform you about new arrivals and offers via email, SMS, or calls." },
                            { title: "Communication", desc: "To contact you regarding orders, inquiries, or account updates." }
                        ].map((item, index) => (
                            <div key={index} className="p-4 rounded-xl border border-border hover:border-amber-500/50 transition-colors bg-card/30">
                                <h4 className="font-bold mb-2 text-orange-600 dark:text-orange-400">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6 border-b pb-2">
                        <Share2 className="text-orange-500 dark:text-orange-400" size={24} />
                        <h2 className="text-2xl font-extrabold tracking-tight">Information Sharing</h2>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        We respect your privacy and only share your information with trusted partners for essential services:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="flex gap-3 bg-muted/30 p-4 rounded-lg">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                            <span className="text-muted-foreground">Service providers handles logistics, payments, and order fulfillment.</span>
                        </li>
                        <li className="flex gap-3 bg-muted/30 p-4 rounded-lg">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                            <span className="text-muted-foreground">Third parties engaged in our marketing and promotional activities.</span>
                        </li>
                        <li className="flex gap-3 bg-muted/30 p-4 rounded-lg col-span-full">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                            <span className="text-muted-foreground">Law enforcement or government institutions, only when strictly required by law.</span>
                        </li>
                    </ul>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b pb-2">
                            <Shield className="text-orange-500 dark:text-orange-400" size={24} />
                            <h2 className="text-2xl font-extrabold tracking-tight">Security</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            We have implemented appropriate technical and organizational measures to ensure your data remains protected. However, please note that no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-3 mb-6 border-b pb-2">
                            <Eye className="text-orange-500 dark:text-orange-400" size={24} />
                            <h2 className="text-2xl font-extrabold tracking-tight">Your Rights</h2>
                        </div>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Lock size={16} className="text-amber-500" />
                                <span>Right to view, modify, or request deletion of your data.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Lock size={16} className="text-amber-500" />
                                <span>Right to object to the processing of your information.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Lock size={16} className="text-amber-500" />
                                <span>Right to opt-out of promotional emails, SMS, or phone calls.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                <section className="bg-amber-50/50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-100 dark:border-amber-900/20">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <MousePointer2 className="text-amber-600 dark:text-amber-400" size={24} />
                                <h2 className="text-2xl font-extrabold tracking-tight text-amber-900 dark:text-amber-200">Cookies</h2>
                            </div>
                            <p className="text-amber-800/80 dark:text-amber-300/70 mb-6 font-medium">
                                Our website uses cookies and similar technologies to enhance your browsing experience and analyze our traffic. You can manage your cookie preferences through your browser settings at any time.
                            </p>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <FileEdit className="text-amber-600 dark:text-amber-400" size={24} />
                                <h2 className="text-2xl font-extrabold tracking-tight text-amber-900 dark:text-amber-200">Policy Changes</h2>
                            </div>
                            <p className="text-amber-800/80 dark:text-amber-300/70 font-medium">
                                We reserve the right to modify this Privacy Policy as needed. Any changes will become effective immediately upon being published on this page.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="text-center pt-8 border-t">
                    <h2 className="text-2xl font-extrabold tracking-tight mb-6">Contact Us</h2>
                    <p className="text-muted-foreground mb-8">
                        If you have any questions, concerns, or suggestions regarding this policy or your personal data, please reach out:
                    </p>
                    <div className="flex flex-wrap justify-center gap-8">
                        <div className="flex items-center gap-3 bg-card shadow-sm border p-4 rounded-2xl">
                            <Phone className="text-amber-600 dark:text-amber-400" size={20} />
                            <div>
                                <p className="text-xs text-muted-foreground text-start font-semibold uppercase tracking-wider">Call Us</p>
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

export default PrivacyPolicyPage;