"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  const handleLanguageChange = (lang: "en" | "ar") => {
    setLanguage(lang)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-white">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{language === "ar" ? "العربية" : "English"}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem className="flex items-center justify-between" onClick={() => handleLanguageChange("ar")}>
          <span>العربية</span>
          {language === "ar" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-between" onClick={() => handleLanguageChange("en")}>
          <span>English</span>
          {language === "en" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
