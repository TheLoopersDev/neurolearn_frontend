import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Image from 'next/image';
import { useEffect } from 'react';

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
import { DialogType } from '@/types/commons';
import { useForgotPasswordMutation } from '@/lib/redux/features/auth/authApi';
import { useToast } from '@/hooks/use-toast';
import SpinnerMini from '@/components/common/ui/SpinnerMini';

type Props = {
  readonly handleDialogChange: (type: DialogType) => void;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
});

export default function ForgotPassword({ handleDialogChange }: Props) {
  const [forgotPassword, { data, error, isSuccess, isLoading }] = useForgotPasswordMutation();
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      toast({
        variant: 'success',
        title: 'Successfully',
        description: data?.message || 'Send OTP successful',
      });
      handleDialogChange('verify-reset-code');
    }
    if (error && 'data' in error) {
      const errorData = error as any;
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: errorData.data.message,
      });
    }
  }, [isSuccess, error, data, toast, handleDialogChange]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      email: values.email,
    };
    await forgotPassword(data);
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
                  <Input {...field} type="email" className={formStyles.textInput} />
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <SpinnerMini />
          ) : (
            <>
              <span>Verify</span> <Image src={arrowTopRightIcon} alt="" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
