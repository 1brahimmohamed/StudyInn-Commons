export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-center w-full">
        <p className="text-sm text-muted-foreground text-center">
          Created by{" "}
          <span className="font-semibold text-foreground">
            a random guy from 2nd Floor
          </span>{" "}
          🏠
        </p>
      </div>
    </footer>
  );
}
