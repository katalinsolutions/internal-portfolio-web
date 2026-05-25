import Container from '@/components/shared/container';

export default function Footer() {
  return (
    <footer className='border-t h-10 flex justify-center items-center'>
      <Container>
        <span className='text-xs font-medium text-muted-foreground'>
          &copy; {new Date().getFullYear()} Katalin Solutions. All rights reserved.
        </span>
      </Container>
    </footer>
  );
}
