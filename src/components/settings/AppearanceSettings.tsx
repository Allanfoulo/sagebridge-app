import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'; 
import { Moon, Sun, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AppearanceSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [density, setDensity] = useState<"default" | "comfortable" | "compact">("default");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Appearance updated",
      description: "Your appearance settings have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Theme</Label>
          <RadioGroup
            defaultValue={theme}
            onValueChange={setTheme}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Label
              htmlFor="light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Sun className="h-6 w-6 mb-2" />
              <span>Light</span>
            </Label>
            <Label
              htmlFor="dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Moon className="h-6 w-6 mb-2" />
              <span>Dark</span>
            </Label>
            <Label
              htmlFor="system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <Monitor className="h-6 w-6 mb-2" />
              <span>System</span>
            </Label>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Density</Label>
          <ToggleGroup 
            type="single" 
            variant="outline"
            value={density}
            onValueChange={(value) => {
              if (value) setDensity(value as "default" | "comfortable" | "compact");
            }}
            className="flex flex-wrap gap-2 justify-start"
          >
            <ToggleGroupItem value="default" aria-label="Default density">
              Default
            </ToggleGroupItem>
            <ToggleGroupItem value="comfortable" aria-label="Comfortable density">
              Comfortable
            </ToggleGroupItem>
            <ToggleGroupItem value="compact" aria-label="Compact density">
              Compact
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline">Reset to defaults</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
