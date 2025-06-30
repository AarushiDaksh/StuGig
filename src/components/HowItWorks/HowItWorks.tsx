"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { clientSteps, freelancerSteps } from "./data"

export default function Explore() {
  const [activeStep, setActiveStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [view, setView] = useState<"client" | "freelancer">("client")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const steps = view === "client" ? clientSteps : freelancerSteps

  useEffect(() => {
    setActiveStep(0) // Reset to step 0 on view change
  }, [view])

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length)
      }, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, steps.length])

  const pauseAnimation = () => setIsPaused(true)
  const resumeAnimation = () => setIsPaused(false)
  const goToStep = (index: number) => {
    setActiveStep(index)
    pauseAnimation()
  }
  const goToPrevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)
    pauseAnimation()
  }
  const goToNextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length)
    pauseAnimation()
  }

  return (
    <section
      className="bg-background py-8 sm:py-12 px-4 sm:px-6"
      aria-labelledby="how-it-works-title"
      onMouseEnter={pauseAnimation}
      onMouseLeave={resumeAnimation}
      onFocus={pauseAnimation}
      onBlur={resumeAnimation}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-16">
          <h2 id="how-it-works-title" className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg mb-4">
            Whether you're posting a request or offering your skills, <strong>StuGig</strong> streamlines student freelancing into three simple steps.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setView("client")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                view === "client"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              For Clients
            </button>
            <button
              onClick={() => setView("freelancer")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                view === "freelancer"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              For Freelancers
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-4 sm:gap-8 items-start">
          <nav
            className="relative flex-col gap-6 sm:gap-8 mx-auto lg:mx-0 max-w-xs hidden lg:flex"
            aria-label="Process steps"
          >
            <div
              className="absolute left-14 top-6 w-0.5 bg-muted"
              style={{ height: "calc(100% - 12px)" }}
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={cn(
                  "relative flex items-start gap-4 text-left transition-all duration-300 group",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md p-2",
                  activeStep === index ? "opacity-100" : "opacity-60 hover:opacity-80"
                )}
                aria-current={activeStep === index ? "step" : undefined}
              >
                <div
                  className={cn(
                    "relative z-10 flex shrink-0 h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2",
                    "transition-colors duration-300",
                    activeStep === index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background group-hover:border-primary/70"
                  )}
                  aria-hidden="true"
                >
                  <span className="text-base sm:text-lg font-medium">{step.id}</span>
                </div>
                <div className="pt-1">
                  <h3 className={cn("text-base sm:text-lg font-semibold", activeStep === index ? "text-foreground" : "text-muted-foreground")}>{step.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">{step.subtitle}</p>
                </div>
              </button>
            ))}
          </nav>

          <div className="relative overflow-hidden rounded-xl border bg-background p-4 sm:p-6 shadow-sm min-h-[300px] sm:min-h-[400px]">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "transition-all duration-500 absolute inset-0 p-4 sm:p-8",
                  activeStep === index ? "translate-x-0 opacity-100" : activeStep > index ? "-translate-x-full opacity-0" : "translate-x-full opacity-0"
                )}
                aria-hidden={activeStep !== index}
              >
                <div className="flex flex-col h-full">
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-6 lg:hidden">{step.title}</h4>
                  <p className="text-muted-foreground mb-4 sm:mb-8 text-base sm:text-lg">{step.subtitle}</p>
                  <ul className="space-y-3 sm:space-y-5 max-w-2xl">
                    {step.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 sm:gap-4">
                        <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-0.5 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span className="text-sm sm:text-base md:text-lg text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 flex gap-2 sm:gap-3">
              <button onClick={goToPrevStep} className="p-2 sm:p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors shadow-sm" aria-label="Previous step">
                <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button onClick={goToNextStep} className="p-2 sm:p-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors shadow-sm" aria-label="Next step">
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
