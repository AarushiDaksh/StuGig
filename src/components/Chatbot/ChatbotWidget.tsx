"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBot from "./ChatBot";
import { cn } from "@/lib/utils";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showInitialAnimation, setShowInitialAnimation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);
    window.addEventListener("orientationchange", updateViewportHeight);
    return () => {
      window.removeEventListener("resize", updateViewportHeight);
      window.removeEventListener("orientationchange", updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialAnimation(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
    };
  }, [isOpen, isMobile]);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            style={
              isMobile
                ? {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                    maxHeight: "-webkit-fill-available",
                    zIndex: 9999,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }
                : undefined
            }
            className={cn(
              isMobile
                ? "bg-background text-foreground"
                : "fixed bottom-16 right-0 w-[450px] h-[600px] rounded-lg border border-border shadow-lg z-[9999] bg-background text-foreground overflow-hidden"
            )}
          >
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-border bg-background">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground">
                    <MessageCircle className="size-5 text-purple-500" />
                    <span className="font-medium">SkillSwap Assistant</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatBot />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: showInitialAnimation ? [0.8, 1.1, 1] : 1,
          opacity: 1,
        }}
        transition={{
          duration: showInitialAnimation ? 0.5 : 0,
          times: showInitialAnimation ? [0, 0.7, 1] : [0, 0, 1],
        }}
        whileHover={{
          scale: 1.05,
          rotate: isOpen ? 0 : 5,
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <span
          className="absolute inset-0 rounded-full animate-ping bg-purple-500/20 opacity-75"
          style={{ animationDuration: "2s" }}
        />
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </motion.div>
      </motion.button>
    </div>
  );
}