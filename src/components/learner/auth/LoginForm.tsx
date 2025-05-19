import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';

import { Button } from '@/components/common/ui/Button2';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/common/ui/Form';
import { Input } from '@/components/common/ui/Input';
import arrowTopRightIcon from '@/public/assets/home/arrow-top-right.svg';
import { formStyles } from '@/styles/styles';
import { useLoginMutation } from '@/lib/redux/features/auth/authApi';
import { useToast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/common/ui/SpinnerMini';
import { DialogType } from '@/types/commons';

type Props = {
  readonly handleOpenDialog: (open: boolean) => void;
  readonly handleDialogChange: (type: DialogType) => void;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .max(20, { message: 'Password must be at most 20 characters long.' })
    .refine(password => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine(password => /[a-z]/.test(password), {
      message: 'Password must contain at least one lower letter.',
    })
    .refine(password => /[0-9]/.test(password), {
      message: 'Password must contain at least one number.',
    })
    .refine(password => /[!@#$%^&*]/.test(password), {
      message: 'Password must contain at least one special character.',
    }),
});

export default function LoginForm({ handleOpenDialog, handleDialogChange }: Props) {
  const [login, { error, isSuccess, isLoading }] = useLoginMutation();
  const { toast } = useToast();

  console.log('LoginForm', login);

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: 'success',
        title: 'Login Successfully',
      });
      handleOpenDialog(false);
    }
    if (error) {
      if ('data' in error) {
        const errorData = error as any;
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: errorData.data.message,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await login({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <fieldset className={formStyles.fieldset}>
                  <Input {...field} type="text" className={formStyles.textInput} />
                  <FormLabel
                    className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                  >
                    Email
                  </FormLabel>
                </fieldset>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <fieldset className={formStyles.fieldset}>
                  <Input {...field} type="password" className={formStyles.textInput} />
                  <FormLabel
                    className={`-z-10 ${formStyles.label} ${field.value ? 'top-0 -translate-y-1/2' : ''}`}
                  >
                    Password
                  </FormLabel>
                </fieldset>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-6 flex items-center justify-end">
          <button
            type="button"
            onClick={() => handleDialogChange('forgot')}
            className="font-medium leading-7 text-[#1d4ed8] -mt-1 cursor-pointer bg-transparent border-none"
          >
            Forgot your password?
          </button>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <SpinnerMini />
          ) : (
            <>
              <span>Log In</span> <Image src={arrowTopRightIcon} alt="" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
