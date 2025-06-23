import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, className = '' }) => {
  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: { x: '100%' }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded flex-shrink-0 mt-1"></div>
            
            <div className="flex-1 space-y-3">
              <div className="relative overflow-hidden bg-gray-200 rounded h-4">
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
              </div>
              
              <div className="relative overflow-hidden bg-gray-200 rounded h-3 w-3/4">
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                    delay: 0.2
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;