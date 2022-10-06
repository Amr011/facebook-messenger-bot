var transactions = [
   {
      id: 3,
      sourceAccount: 'A',
      targetAccount: 'B',
      amount: 100,
      category: 'eating_out',
      time: '2018-03-02T10:34:30.000Z',
   },
   {
      id: 1,
      sourceAccount: 'A',
      targetAccount: 'B',
      amount: 100,
      category: 'eating_out',
      time: '2018-03-02T10:33:00.000Z',
   },
   {
      id: 6,
      sourceAccount: 'A',
      targetAccount: 'C',
      amount: 250,
      category: 'other',
      time: '2018-03-02T10:33:05.000Z',
   },
   {
      id: 4,
      sourceAccount: 'A',
      targetAccount: 'B',
      amount: 100,
      category: 'eating_out',
      time: '2018-03-02T10:36:00.000Z',
   },
   {
      id: 2,
      sourceAccount: 'A',
      targetAccount: 'B',
      amount: 100,
      category: 'eating_out',
      time: '2018-03-02T10:33:50.000Z',
   },
   {
      id: 5,
      sourceAccount: 'A',
      targetAccount: 'C',
      amount: 250,
      category: 'other',
      time: '2018-03-02T10:33:00.000Z',
   },
]

const getTransactionKey = ({
   sourceAccount,
   targetAccount,
   category,
   amount,
}) => `${sourceAccount}-${targetAccount}${category}${amount}`

const findDuplicateTransactions = (transactions = []) => {
   transactions.sort((a, b) => new Date(a.time) - new Date(b.time))
   const transactionsByKey = {}
   for (const transaction of transactions) {
      const key = getTransactionKey(transaction)
      transactionsByKey[key] = transactionsByKey[key] || []
      transactionsByKey[key].push(transaction)
   }

   // Separate each transactionsByKey[key] array into arrays of definite duplicates
   // and combine all such arrays of definite duplicates into a single array
   const allTransactionGroups =
      Object.values(transactionsByKey).flatMap(groupDuplicates)

   const duplicateTransactionGroups = allTransactionGroups.filter(
      (subarr) => subarr.length >= 2
   )

   return duplicateTransactionGroups
}

/**
 * Separate each transactionsByKey[key] array into arrays of definite duplicates, eg:
 * [{ source: 'A' ... }, { source: 'B' ... }, { source: 'B' ... }]
 * to
 * [[{ source: 'A' ... }], [{ source: 'B' ... }, { source: 'B' ... }]]
 */
const groupDuplicates = (similarTransactions) => {
   const duplicateGroups = []
   for (const transaction of similarTransactions) {
      // Find the first subarray in duplicateGroups whose time matches, and push to that subarray
      // If no match, create a new subarray
      const foundGroup = duplicateGroups.find((subarr) =>
         isDuplicateTime(subarr[subarr.length - 1], transaction)
      )
      if (foundGroup) {
         foundGroup.push(transaction)
      } else {
         duplicateGroups.push([transaction])
      }
   }
   return duplicateGroups
}

const isDuplicateTime = (transaction1, transaction2) =>
   Math.abs(new Date(transaction1.time) - new Date(transaction2.time)) < 60_000

console.log(findDuplicateTransactions(transactions))
