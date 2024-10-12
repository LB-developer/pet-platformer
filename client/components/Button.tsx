import { HtmlHTMLAttributes } from 'react'

type ButtonProps = HtmlHTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean
}

function Button({ children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`m-10 rounded px-4 py-2 ${
        disabled
          ? 'cursor-not-allowed bg-gray-400 text-gray-200'
          : 'bg-spamBlue text-spamYellow hover:bg-spamYellow hover:text-spamBlue'
      }`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
