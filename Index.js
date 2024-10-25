
const Pipeline=require('./Pipeline')

const runBatchProcess=require('./BatchProcess')

const connectDatabase=require('./databaseConnection');
connectDatabase();

runBatchProcess(Pipeline);
