import { Shield, CheckCircle, AlertCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type VerificationLevel = "verified" | "trusted" | "new" | "unverified"

interface VerificationBadgeProps {
  level: VerificationLevel
  showTooltip?: boolean
  className?: string
}

export function VerificationBadge({ level, showTooltip = true, className }: VerificationBadgeProps) {
  const getBadgeContent = () => {
    switch (level) {
      case "verified":
        return {
          icon: <CheckCircle className="h-3 w-3 mr-1" />,
          text: "Verified",
          variant: "default" as const,
          tooltip: "This provider has been verified by our team",
        }
      case "trusted":
        return {
          icon: <Shield className="h-3 w-3 mr-1" />,
          text: "Trusted",
          variant: "secondary" as const,
          tooltip: "This provider has completed 10+ jobs with high ratings",
        }
      case "new":
        return {
          icon: <Info className="h-3 w-3 mr-1" />,
          text: "New",
          variant: "outline" as const,
          tooltip: "This provider is new to the platform",
        }
      case "unverified":
        return {
          icon: <AlertCircle className="h-3 w-3 mr-1" />,
          text: "Unverified",
          variant: "destructive" as const,
          tooltip: "This provider has not completed verification",
        }
    }
  }

  const content = getBadgeContent()

  const badgeElement = (
    <Badge variant={content.variant} className={className}>
      {content.icon}
      {content.text}
    </Badge>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badgeElement}</TooltipTrigger>
          <TooltipContent>
            <p>{content.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return badgeElement
}

