"use client"

import { useState } from "react"
import { Check, ChevronRight, User, Briefcase, Wallet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

interface OnboardingWizardProps {
  onComplete: () => void
  onDismiss?: () => void
}

export function OnboardingWizard({ onComplete, onDismiss }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<"client" | "provider" | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    bio: "",
    skills: "",
    categories: [] as string[],
  })
  const { toast } = useToast()

  const handleNext = () => {
    if (step === 1 && !userType) {
      toast({
        title: "Selection required",
        description: "Please select whether you want to hire or provide services.",
        variant: "destructive",
      })
      return
    }

    if (step === 2) {
      if (!formData.fullName.trim()) {
        toast({
          title: "Name required",
          description: "Please enter your full name to continue.",
          variant: "destructive",
        })
        return
      }
    }

    if (step < 4) {
      setStep(step + 1)
    } else {
      // Submit data
      // In a real app, this would be an API call
      toast({
        title: "Profile setup complete!",
        description: "Your profile has been successfully set up.",
      })
      onComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleCategoryToggle = (category: string) => {
    if (formData.categories.includes(category)) {
      updateFormData(
        "categories",
        formData.categories.filter((c) => c !== category),
      )
    } else {
      updateFormData("categories", [...formData.categories, category])
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Welcome to I-service</CardTitle>
          {onDismiss && (
            <Button variant="ghost" size="icon" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>Let's set up your profile in a few quick steps</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step >= i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > i ? <Check className="h-4 w-4" /> : i}
              </div>
              {i < 4 && <div className={`h-1 w-10 ${step > i ? "bg-primary" : "bg-muted"}`}></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Choose user type */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium">How do you want to use I-service?</h3>
            <RadioGroup value={userType || ""} onValueChange={(value) => setUserType(value as "client" | "provider")}>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">I want to hire services</div>
                      <div className="text-sm text-muted-foreground">Post jobs and find skilled professionals</div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                <RadioGroupItem value="provider" id="provider" />
                <Label htmlFor="provider" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">I want to provide services</div>
                      <div className="text-sm text-muted-foreground">Offer your skills and earn money</div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Basic profile info */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-medium">Tell us about yourself</h3>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => updateFormData("fullName", e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => updateFormData("bio", e.target.value)}
                placeholder="Tell us a bit about yourself"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Step 3: Skills and expertise (for providers) */}
        {step === 3 && userType === "provider" && (
          <div className="space-y-4">
            <h3 className="font-medium">Your skills and expertise</h3>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma separated)</Label>
              <Textarea
                id="skills"
                value={formData.skills}
                onChange={(e) => updateFormData("skills", e.target.value)}
                placeholder="e.g., Web Development, Logo Design, Content Writing"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Web Development", "Graphic Design", "Writing", "Marketing", "Video Editing", "Translation"].map(
                  (category) => (
                    <div
                      key={category}
                      className={`border rounded-md p-2 cursor-pointer text-sm ${
                        formData.categories.includes(category) ? "bg-primary/10 border-primary" : "hover:border-primary"
                      }`}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences (for clients) */}
        {step === 3 && userType === "client" && (
          <div className="space-y-4">
            <h3 className="font-medium">Your preferences</h3>
            <div className="space-y-2">
              <Label>What services are you interested in?</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Web Development", "Graphic Design", "Writing", "Marketing", "Video Editing", "Translation"].map(
                  (category) => (
                    <div
                      key={category}
                      className={`border rounded-md p-2 cursor-pointer text-sm ${
                        formData.categories.includes(category) ? "bg-primary/10 border-primary" : "hover:border-primary"
                      }`}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment setup */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-medium">Connect your wallet</h3>
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center">
                <Wallet className="h-8 w-8 text-primary mr-3" />
                <div>
                  <div className="font-medium">Secure blockchain payments</div>
                  <div className="text-sm text-muted-foreground">
                    Connect your wallet to {userType === "provider" ? "receive payments" : "pay for services"}
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4">Connect Wallet</Button>
            </div>
            <div className="text-sm text-muted-foreground">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div></div>
        )}
        <Button onClick={handleNext}>
          {step < 4 ? (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Complete Setup"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

