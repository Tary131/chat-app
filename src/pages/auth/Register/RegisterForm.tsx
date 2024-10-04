import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRegisterForm } from './useRegisterForm.ts';
import {
  FirstNameField,
  LastNameField,
  EmailField,
  PasswordField,
} from '../FormFields.tsx';
import { RegisterValues } from '@/types/formValues.ts';
import { ROUTES } from '@/constants/routes.ts';
import { Spinner } from '@/components/custom/Spinner.tsx';
import { registerSchema } from './validationSchema.ts';
import MessageDisplay from '../MessageDisplay.tsx';

const RegisterForm = () => {
  const { handleSubmitForm, errorMessage, successMessage, isLoading } =
    useRegisterForm();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterValues> = async (data) => {
    await handleSubmitForm(data, reset);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm md:max-w-md lg:max-w-lg">
        <CardHeader>
          <CardTitle className=" flex justify-center text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FirstNameField
                  register={register('firstName')}
                  error={errors.firstName}
                />
                <LastNameField
                  register={register('lastName')}
                  error={errors.lastName}
                />
              </div>
              <EmailField register={register('email')} error={errors.email} />
              <PasswordField
                register={register('password')}
                error={errors.password}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Create an account'}
              </Button>
            </fieldset>
          </form>
          <MessageDisplay
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
