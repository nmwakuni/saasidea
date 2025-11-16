'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Calendar,
  Clock,
} from 'lucide-react';

type PaymentMethod = 'pesapal' | 'mpesa' | null;
type PlanTier = 'creator' | 'pro' | 'agency';

interface PaymentState {
  method: PaymentMethod;
  amount: number;
  plan: PlanTier;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  processing: boolean;
  success: boolean;
  error: string | null;
  transactionId: string | null;
}

export default function BillingPage() {
  const [payment, setPayment] = useState<PaymentState>({
    method: null,
    amount: 79,
    plan: 'creator',
    phoneNumber: '',
    email: '',
    firstName: '',
    lastName: '',
    processing: false,
    success: false,
    error: null,
    transactionId: null,
  });

  const plans = [
    {
      id: 'creator' as PlanTier,
      name: 'Creator',
      price: 79,
      currency: 'USD',
      ksh: 10000,
      features: [
        '10 hours of content/month',
        '2 brand profiles',
        'LinkedIn + Twitter',
        'Basic analytics',
        'Email support',
      ],
    },
    {
      id: 'pro' as PlanTier,
      name: 'Pro',
      price: 199,
      currency: 'USD',
      ksh: 25000,
      features: [
        '40 hours of content/month',
        '5 brand profiles',
        'All platforms',
        'Advanced analytics',
        'Priority support',
        'API access',
      ],
      popular: true,
    },
    {
      id: 'agency' as PlanTier,
      name: 'Agency',
      price: 499,
      currency: 'USD',
      ksh: 63000,
      features: [
        '200 hours of content/month',
        'Unlimited brands',
        'All platforms + white-label',
        'Custom analytics',
        'Dedicated support',
        'Full API access',
        'Team collaboration',
      ],
    },
  ];

  const selectPlan = (planId: PlanTier) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      setPayment((prev) => ({
        ...prev,
        plan: planId,
        amount: plan.price,
      }));
    }
  };

  const handlePesapalPayment = async () => {
    setPayment((prev) => ({ ...prev, processing: true, error: null }));

    try {
      // TODO: Implement actual Pesapal payment API call
      const response = await fetch('/api/payments/pesapal/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: payment.amount,
          email: payment.email,
          firstName: payment.firstName,
          lastName: payment.lastName,
          phoneNumber: payment.phoneNumber,
          plan: payment.plan,
        }),
      });

      const data = await response.json();

      if (data.redirect_url) {
        // Redirect to Pesapal payment page
        window.location.href = data.redirect_url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (error: any) {
      setPayment((prev) => ({
        ...prev,
        processing: false,
        error: error.message || 'Payment failed. Please try again.',
      }));
    }
  };

  const handleMpesaPayment = async () => {
    setPayment((prev) => ({ ...prev, processing: true, error: null }));

    try {
      // Validate phone number
      if (!payment.phoneNumber || payment.phoneNumber.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      // TODO: Implement actual M-Pesa payment API call
      const plan = plans.find((p) => p.id === payment.plan);
      const response = await fetch('/api/payments/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: payment.phoneNumber,
          amount: plan?.ksh || payment.amount * 126.5, // Convert USD to KSH
          accountReference: `SUB-${payment.plan.toUpperCase()}`,
          description: `ContentForge ${plan?.name} Plan Subscription`,
        }),
      });

      const data = await response.json();

      if (data.ResponseCode === '0') {
        setPayment((prev) => ({
          ...prev,
          processing: false,
          success: true,
          transactionId: data.CheckoutRequestID,
        }));

        // Poll for payment status
        pollMpesaStatus(data.CheckoutRequestID);
      } else {
        throw new Error(data.CustomerMessage || 'Payment initiation failed');
      }
    } catch (error: any) {
      setPayment((prev) => ({
        ...prev,
        processing: false,
        error: error.message || 'Payment failed. Please try again.',
      }));
    }
  };

  const pollMpesaStatus = async (checkoutRequestID: string) => {
    let attempts = 0;
    const maxAttempts = 20; // Poll for 2 minutes (20 * 6 seconds)

    const poll = setInterval(async () => {
      attempts++;

      try {
        const response = await fetch(
          `/api/payments/mpesa/status?checkoutRequestID=${checkoutRequestID}`
        );
        const data = await response.json();

        if (data.ResultCode === '0') {
          // Payment successful
          clearInterval(poll);
          setPayment((prev) => ({
            ...prev,
            success: true,
            processing: false,
          }));
          alert('Payment successful! Your subscription has been activated.');
        } else if (data.ResultCode !== undefined && data.ResultCode !== '0') {
          // Payment failed
          clearInterval(poll);
          setPayment((prev) => ({
            ...prev,
            processing: false,
            error: data.ResultDesc || 'Payment was not completed',
          }));
        }
      } catch (error) {
        console.error('Status check error:', error);
      }

      if (attempts >= maxAttempts) {
        clearInterval(poll);
        setPayment((prev) => ({
          ...prev,
          processing: false,
          error: 'Payment timeout. Please check your M-Pesa messages.',
        }));
      }
    }, 6000); // Check every 6 seconds
  };

  const resetPayment = () => {
    setPayment({
      method: null,
      amount: payment.amount,
      plan: payment.plan,
      phoneNumber: '',
      email: '',
      firstName: '',
      lastName: '',
      processing: false,
      success: false,
      error: null,
      transactionId: null,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Billing & Payments</h1>
        <p className="mt-2 text-gray-600">Choose your plan and payment method</p>
      </div>

      {/* Plan Selection */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              payment.plan === plan.id
                ? 'border-blue-500 ring-2 ring-blue-500'
                : plan.popular
                  ? 'border-purple-500'
                  : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-purple-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
                  POPULAR
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">KSH {plan.ksh.toLocaleString()}</div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => selectPlan(plan.id)}
                className="w-full"
                variant={payment.plan === plan.id ? 'default' : 'outline'}
              >
                {payment.plan === plan.id ? 'Selected' : 'Select Plan'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method Selection */}
      {payment.plan && !payment.success && (
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
            <CardDescription>Choose how you'd like to pay</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={payment.method || 'pesapal'}
              onValueChange={(value) =>
                setPayment((prev) => ({ ...prev, method: value as PaymentMethod }))
              }
            >
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="pesapal">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pesapal
                </TabsTrigger>
                <TabsTrigger value="mpesa">
                  <Smartphone className="h-4 w-4 mr-2" />
                  M-Pesa
                </TabsTrigger>
              </TabsList>

              {/* Pesapal Payment */}
              <TabsContent value="pesapal" className="space-y-6 mt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={payment.firstName}
                      onChange={(e) =>
                        setPayment((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={payment.lastName}
                      onChange={(e) =>
                        setPayment((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={payment.email}
                    onChange={(e) => setPayment((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={payment.phoneNumber}
                    onChange={(e) =>
                      setPayment((prev) => ({ ...prev, phoneNumber: e.target.value }))
                    }
                    placeholder="+254712345678"
                    required
                  />
                </div>

                {payment.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{payment.error}</p>
                  </div>
                )}

                <Button
                  onClick={handlePesapalPayment}
                  disabled={
                    payment.processing || !payment.email || !payment.firstName || !payment.lastName
                  }
                  className="w-full"
                >
                  {payment.processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ${payment.amount} with Pesapal</>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Secure payment powered by Pesapal</span>
                </div>
              </TabsContent>

              {/* M-Pesa Payment */}
              <TabsContent value="mpesa" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                  <Input
                    id="mpesaPhone"
                    type="tel"
                    value={payment.phoneNumber}
                    onChange={(e) =>
                      setPayment((prev) => ({ ...prev, phoneNumber: e.target.value }))
                    }
                    placeholder="0712345678 or 254712345678"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Enter the phone number registered with M-Pesa
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">How M-Pesa Payment Works:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Click "Pay with M-Pesa" button below</li>
                        <li>You'll receive an STK push on your phone</li>
                        <li>Enter your M-Pesa PIN to complete payment</li>
                        <li>You'll receive a confirmation SMS</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {payment.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{payment.error}</p>
                  </div>
                )}

                {payment.processing && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5 animate-pulse" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium mb-1">Waiting for payment confirmation...</p>
                        <p>Please check your phone and enter your M-Pesa PIN</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleMpesaPayment}
                  disabled={payment.processing || !payment.phoneNumber}
                  className="w-full"
                >
                  {payment.processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Waiting for PIN entry...
                    </>
                  ) : (
                    <>
                      Pay KSH {plans.find((p) => p.id === payment.plan)?.ksh.toLocaleString()} with
                      M-Pesa
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Secure payment powered by Safaricom M-Pesa</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {payment.success && (
        <Card className="border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-900 mb-2">Payment Successful!</h3>
                <p className="text-green-800 mb-4">
                  Your {plans.find((p) => p.id === payment.plan)?.name} plan subscription has been
                  activated.
                </p>
                {payment.transactionId && (
                  <p className="text-sm text-green-700 mb-4">
                    Transaction ID: <code className="font-mono">{payment.transactionId}</code>
                  </p>
                )}
                <Button onClick={resetPayment} variant="outline">
                  Make Another Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Security Notice */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Secure Payment Processing</h4>
              <p className="text-sm text-gray-700">
                All payments are processed securely through certified payment gateways. We do not
                store your payment information. Your data is encrypted and protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
