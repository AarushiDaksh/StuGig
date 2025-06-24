"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, Variants } from "framer-motion"
import { toast } from "sonner"
import { Smile, NotebookPen, MessageCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/sonner"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(500),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (res.ok) {
        toast("Message sent successfully!", {
          description: "We'll reach out to you shortly.",
        })
        form.reset()
      } else {
        toast("Submission failed", {
          description: "Please try again later.",
        })
      }
    } catch (error) {
      toast("Error submitting form", {
        description: "An unexpected error occurred.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-2xl mx-auto mt-10 p-6 sm:p-8 rounded-xl shadow-xl border bg-white dark:bg-black/80 dark:border-gray-700 border-gray-200"
    >
      <Toaster />

      <motion.div variants={itemVariants} className="space-y-2 text-center mb-8">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Connect with Contributors
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto">
          Want to partner with us, share feedback, or ask something? We’d love to connect!
        </p>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                          className="pl-10 rounded-xl bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          placeholder="Your Name"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <NotebookPen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                          className="pl-10 rounded-xl bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                          placeholder="you@example.com"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px] rounded-xl bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Share your thoughts, proposals, or questions..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Tell us what you're thinking — we’re here to collaborate and grow together.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-gray-800 to-gray-600 hover:from-gray-900 hover:to-gray-700 text-white dark:from-white dark:to-gray-200 dark:hover:from-white dark:hover:to-white dark:text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  )
}
