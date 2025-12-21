"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      features: [
        "Access to 2 Reading tests",
        "Basic practice materials",
        "Limited test attempts",
        "Community forum access",
      ],
      highlighted: false,
    },
    {
      name: "Standard",
      price: "$19",
      period: "/month",
      features: [
        "All Free features",
        "Access to all Reading tests",
        "Access to all Listening tests",
        "Unlimited test attempts",
        "Progress tracking",
        "Email support",
      ],
      highlighted: true,
    },
    {
      name: "Premium",
      price: "$39",
      period: "/month",
      features: [
        "All Standard features",
        "Access to Writing tests",
        "Access to Speaking practice",
        "Detailed performance analytics",
        "Priority support",
        "Downloadable certificates",
        "Ad-free experience",
      ],
      highlighted: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto px-6">
          <h1 className="mb-6 text-center text-5xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mx-auto mb-16 max-w-3xl text-center text-xl text-gray-600">
            Select the plan that best fits your learning goals and budget.
          </p>

          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`overflow-hidden rounded-2xl border p-8 shadow-sm transition-all hover:shadow-lg ${
                  plan.highlighted ? "scale-105 border-red-600 bg-red-50 shadow-md" : "border-gray-200 bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="mb-4 text-center">
                    <span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="mb-2 text-center text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mb-6 text-center">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full rounded-lg py-3 text-white transition-colors ${
                    plan.highlighted ? "bg-red-600 hover:bg-red-700" : "bg-gray-900 hover:bg-gray-800"
                  }`}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
