"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CheckCircle2Icon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function SignupForm({ className,...props }: React.ComponentProps<"div">) {
   const router = useRouter();

   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');

   const [nameError, setNameError] = useState('');
   const [emailError, setEmailError] = useState('');
   const [passwordError, setPasswordError] = useState('');
   const [confirmPasswordError, setConfirmPasswordError] = useState('');

   const [showSuccess, setShowSuccess] = useState(false);

   const validateMinLength = (value: string, min: number, label: string) => {
    if (value.length < min) return `${label} deve ter no mínimo ${min} caracteres`;
      return '';
   };
   const validateEmail = (value: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      return regex.test(value) ? '' : 'Email inválido';
   };
   const validatePasswordMatch = (password: string, confirm: string) => {
    if (password !== confirm) return 'As senhas não coincidem'
      return '';
   };

   const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailErro = validateEmail(email);
    const passwordErro = validateMinLength(password, 4, 'A senha');
    const confirmPasswordErro = validatePasswordMatch(password, confirmPassword);

    setEmailError(emailErro);
    setPasswordError(passwordErro);
    setConfirmPasswordError(confirmPasswordErro);

    if (emailErro || passwordErro || confirmPasswordErro) return;

    // confirmação mock para teste
    setShowSuccess(true);
   };
  
  if (showSuccess){
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Alert className="flex items-center justify-between gap-4">
  <div className="flex items-start gap-3">
    <CheckCircle2Icon className="h-5 w-5 mt-0.5" />
      <div>
        <AlertTitle>Conta criada com sucesso!</AlertTitle>
          <AlertDescription>
            Agora você pode fazer login com suas credenciais.
          </AlertDescription>
      </div>
  </div>
  <Button className="shrink-0" onClick={() => router.push('/')}>
    OK
  </Button>
</Alert>

      </div>
    );
  } 

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
          <CardDescription>
            Insira seu email abaixo para criar sua  conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Como você quer ser chamado?</FieldLabel>
                <Input id="name" type="text" placeholder="Insira o seu nome" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailError(validateEmail(email))}
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              </Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setPasswordError(validateMinLength(password, 4, 'A senha'))}
                    />
                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirme a Senha
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() => setPasswordError(validatePasswordMatch(password, confirmPassword))}
                    />
                    {setConfirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
                  </Field>
                </Field>
                <Button type="submit">Criar Conta</Button>
        
                  <FieldDescription className="text-center">
                    Você já possui uma conta? <a href="/">Faça Login</a>
                  </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
