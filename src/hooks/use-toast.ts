import { toast } from "sonner"

export const useToast = () => {
  return {
    toast: (options: {
      title?: string
      description?: string
      variant?: "default" | "destructive"
    }) => {
      const { title, description, variant } = options
      
      if (variant === "destructive") {
        toast.error(title || description || "Error")
      } else {
        toast.success(title || description || "Success")
      }
    }
  }
} 