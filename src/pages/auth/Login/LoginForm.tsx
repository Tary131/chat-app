import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EmailField, PasswordField } from '../FormFields';
import { LoginValues } from '@/types/formValues';
import { ROUTES } from '@/constants/routes';
import { Spinner } from '@/components/custom/Spinner';
import { loginSchema } from './validationSchema';
import { useLoginForm } from './useLoginForm';
import MessageDisplay from '../MessageDisplay';

const LoginForm = () => {
  const { handleSubmitForm, errorMessage, successMessage, isLoading } =
    useLoginForm();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginValues> = async (data) => {
    await handleSubmitForm(data, reset);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm md:max-w-md lg:max-w-lg">
        <CardHeader>
          <CardTitle className=" flex justify-center text-xl">
            Sign In
          </CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset disabled={isLoading} className="grid gap-4">
              <EmailField register={register('email')} error={errors.email} />
              <PasswordField
                register={register('password')}
                error={errors.password}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Sign In'}
              </Button>
            </fieldset>
          </form>
          <MessageDisplay
            errorMessage={errorMessage}
            successMessage={successMessage}
          />
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
