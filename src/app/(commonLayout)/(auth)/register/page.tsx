import RegisterForm from "@/components/modules/Auth/RegisterForm";



interface LoginParams {
  searchParams: Promise<{ redirect?: string }>;
}

const RegisterPage = async ({ searchParams }: LoginParams) => {
  const params = await searchParams;
  const redirectPath = params.redirect;
  return (
    <RegisterForm redirectPath={redirectPath} />
  )
}

export default RegisterPage