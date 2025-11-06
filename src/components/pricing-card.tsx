import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PricingCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant?: "default" | "secondary" | "outline"
  recommended?: boolean
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = "default",
  recommended = false,
}: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex flex-col border-border bg-card transition-all hover:shadow-lg",
        recommended && "border-accent shadow-md",
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-accent text-accent-foreground border-accent">Recommended</Badge>
        </div>
      )}
      <CardHeader className="pb-8">
        <CardTitle className="text-2xl font-bold text-card-foreground">{name}</CardTitle>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight text-card-foreground">{price}</span>
          <span className="text-muted-foreground">{period}</span>
        </div>
        <CardDescription className="mt-4 text-base text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <Check className="h-5 w-5 shrink-0 text-accent mt-0.5" />
              <span className="text-sm leading-relaxed text-card-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={buttonVariant}
          className={cn(
            "w-full",
            recommended && buttonVariant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
          )}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
