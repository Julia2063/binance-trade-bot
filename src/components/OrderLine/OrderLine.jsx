import { format } from "date-fns";

import { cryptoSymbol } from 'crypto-symbol'

function OrderLine({ data }) {

    const  { nameLookup }  =  cryptoSymbol ( { } );
    const { symbolLookup } = cryptoSymbol({});

    const pair = data?.symbol.split('/')[0];
    
    return (

        <div className="dashboard__ordersSection__table__item" >
         
            <div>{format(new Date(data.created_at * 1000), 'dd-MM-yyyy')}</div>
            <div>{format(new Date(data.created_at * 1000), 'HH:mm:ss')}</div>
            <div>???</div>
            <div className="coin">{pair && `${nameLookup(pair)} (${symbolLookup(nameLookup(pair))})`}</div>
            <div>{(+data.buy_base_qty).toFixed(2)}</div>
            <div>{(+data.buy_quote_qty).toFixed(2)}</div>
            <div>{(+data.buy_price).toFixed(2)}</div>
            <div>{(+data.sell_base_qty).toFixed(2) }</div>
            <div>{(+data.sell_quote_qty).toFixed(2)}</div>
            <div>{(+data.sell_price).toFixed(2)}</div>
            <div>{(+data.fee_sell_stable - +data.fee_buy_stable).toFixed(4)}</div>
            <div className="profit">{(+data.profit_stable).toFixed(2)}</div>
         
        </div>
    )
};

export default OrderLine;

