import { useFetchQuote } from "./MetalsResource";

import './Metals.css'
export default function Metals() {
    const [quote, isLoading, error] = useFetchQuote();

    const formatCurrency = (amount: number, locale = 'en-US', currency = 'USD') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    const formatDate = (timestamp: number) => {
        //1/2/2026 10:33:00
        const formattedDateIntl = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Use 24-hour time
        }).format(timestamp);
        return formattedDateIntl;
    }
    return (
        <div className="metalscontainer">
            <div className="quotecontainer">
                <div className="item">Gold</div>
                <div className="item">{isLoading ? '-' : formatCurrency(quote.au)}</div>
                <div className="item">Silver</div>
                <div className="item">{isLoading ? '-' : formatCurrency(quote.ag)}</div>
                <div className="item">Platinum</div>
                <div className="item">{isLoading ? '-' : formatCurrency(quote.pt)}</div>
                <div className="footnote">Last updated {formatDate(quote.ts)}</div>
            </div>
        </div>
    )
}