import './ProgressBar.scss';

export const ProgressBar = ({ proc }) => {
    return (
        <div className='progressBar'>
            <p className='progressBar__title'>
                100 million tokens
            </p>
            <div>
                <div className='progressBar__item'>
                    <div style={{ width: proc }}/>
                </div>
            </div>
            <p className='progressBar__price'>
                1 token - 1 $
            </p>
        </div>
    )
};