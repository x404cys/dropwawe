import { PricingCard } from '@/components/pricing-card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export default function Plans() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge
            variant="secondary"
            className="bg-accent/20 text-accent-foreground border-accent/30 mb-6"
          >
            New
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl">
            Plans and Pricing
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg text-balance">
            Get started immediately for free. Upgrade for more credits, usage and collaboration.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {/* Free Plan */}
          <PricingCard
            name="Free"
            price="$0"
            period="/month"
            description="For people looking to explore."
            features={[
              '$5 of included monthly credits',
              'Deploy apps to Vercel',
              'Edit visually with Design Mode',
              'Sync with GitHub',
            ]}
            buttonText="Start Building"
            buttonVariant="secondary"
          />

          {/* Premium Plan */}
          <PricingCard
            name="Premium"
            price="$20"
            period="/month"
            description="For higher limits and power users."
            features={[
              '$20 of included monthly credits',
              'Purchase additional credits outside of your monthly usage',
              '5x higher attachment size limit',
              'Import from Figma',
              'Access to v0 API',
            ]}
            buttonText="Upgrade to Premium"
            buttonVariant="default"
          />

          {/* Team Plan */}
          <PricingCard
            name="Team"
            price="$30"
            period="/user/month"
            description="For fast moving teams and collaboration."
            features={[
              '$30 of included monthly credits per user',
              'Purchase additional credits outside of your monthly usage shared across your team',
              'Centralized billing on vercel.com',
              'Share chats and collaborate with your team',
              'Access to v0 API',
            ]}
            buttonText="Start a Team plan"
            buttonVariant="default"
            recommended
          />
        </div>

        {/* Enterprise Section */}
        <div className="mx-auto mt-12 max-w-7xl">
          <div className="border-border bg-card rounded-lg border p-8 md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h2 className="text-card-foreground mb-2 text-2xl font-bold">Enterprise</h2>
                <p className="text-muted-foreground mb-6">
                  For large companies that require additional security.
                </p>
                <ul className="space-y-3">
                  {[
                    'Training opt-out by default',
                    'SAML SSO',
                    'Priority access for better performance and no queues',
                    'Dedicated customer support',
                    'Access to v0 API',
                  ].map(feature => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="text-accent mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-card-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:ml-8">
                <button className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 w-full rounded-lg border px-8 py-3 font-medium transition-colors md:w-auto">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
