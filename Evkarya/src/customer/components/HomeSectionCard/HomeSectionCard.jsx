import { Link } from 'react-router-dom';

const HomeSectionCard = ({ product }) => {
    return (
        <Link to={`/product/${product._id}`}>
            <div className="cursor-pointer flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden w-[220px] h-[300px] mx-2 border transition-transform duration-300 hover:scale-105">
                {/* Image */}
                <div className="w-full h-[150px] bg-gray-50 flex items-center justify-center">
                    <img
                        src={product.imageUrl || '/default-image.jpg'}
                        alt={product.title || 'Product Image'}
                        className="w-full h-full object-contain p-2"
                    />
                </div>

                {/* Product Info */}
                <div className="p-3 w-full flex flex-col justify-between h-[150px]">
                    
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.title || 'No title available'}
                    </p>

                    {product.discountedPrice && (
                        <p className="text-base font-bold text-gray-800 mt-2">
                            ₹{product.discountedPrice}
                        </p>
                    )}

                    {product.description && (
                        <p className="text-[11px] text-gray-400 mt-2 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};
export default HomeSectionCard;