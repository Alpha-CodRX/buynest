type AppButtonProps = {
    text: string;
}

    export default function AppButton({
    text,
    }: AppButtonProps) {
    return (
        <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        {text}
        </button>
    );
    } 