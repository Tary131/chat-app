import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { ErrorMessage } from '@/components/messages';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface FieldProps {
  label?: string;
  id?: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
}

export const FormField = ({
  label,
  id,
  placeholder,
  type = 'text',
  register,
  error,
  required = false,
}: FieldProps) => (
  <div className="grid gap-2">
    <Label htmlFor={id}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    <Input id={id} placeholder={placeholder} type={type} {...register} />
    {error && <ErrorMessage message={error.message!} />}
  </div>
);

export const FirstNameField = ({ register, error }: FieldProps) => (
  <FormField
    label="First Name"
    id="first-name"
    placeholder="Max"
    register={register}
    error={error}
    required
  />
);

export const LastNameField = ({ register, error }: FieldProps) => (
  <FormField
    label="Last Name"
    id="last-name"
    placeholder="Robinson"
    register={register}
    error={error}
    required
  />
);

export const EmailField = ({ register, error }: FieldProps) => (
  <FormField
    label="Email"
    id="email"
    placeholder="m@example.com"
    type="email"
    register={register}
    error={error}
    required
  />
);

export const PasswordField = ({ register, error }: FieldProps) => (
  <FormField
    label="Password"
    id="password"
    type="password"
    register={register}
    error={error}
    required
  />
);
