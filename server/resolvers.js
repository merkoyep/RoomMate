const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Wallet = require('./models/Wallet');
const Category = require('./models/Category');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET;

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        return await User.find().select('+password');
      } catch (error) {
        throw new Error('Error fetching users');
      }
    },
    getUser: async (_, { id }) => {
      try {
        return await User.findById(id).select('+password');
      } catch (error) {
        throw new Error('Error fetching user');
      }
    },
    getTransactions: async () => {
      try {
        const transactions = await Transaction.find()
          .populate('paidBy')
          .populate('user')
          .populate('splits.userId')
          .sort({ transactionDate: -1 });

        return transactions
          .filter((transaction) => {
            if (!transaction.paidBy || !transaction.user) {
              console.warn(
                `Skipping transaction ${transaction._id} due to missing references`
              );
              return false;
            }
            return true;
          })
          .map((transaction) => {
            const transactionObj = transaction.toObject();

            const validSplits = transactionObj.splits
              .filter((split) => {
                if (!split.userId) {
                  console.warn(
                    `Skipping split in transaction ${transactionObj._id} due to missing user`
                  );
                  return false;
                }
                return true;
              })
              .map((split) => ({
                userId: split.userId._id.toString(),
                percent: split.percent,
                value: split.value,
                user: {
                  id: split.userId._id.toString(),
                  username: split.userId.username,
                  email: split.userId.email,
                },
              }));

            const result = {
              ...transactionObj,
              id: transactionObj._id.toString(),
              paidBy: {
                id: transactionObj.paidBy._id.toString(),
                username: transactionObj.paidBy.username,
                email: transactionObj.paidBy.email,
              },
              user: {
                id: transactionObj.user._id.toString(),
                username: transactionObj.user.username,
                email: transactionObj.user.email,
              },
              splits: validSplits,
              createdAt: transactionObj.createdAt.toISOString(),
              transactionDate: transactionObj.transactionDate.toISOString(),
            };

            return result;
          });
      } catch (error) {
        console.error('Error in getTransactions:', error);
        throw new Error('Error fetching transactions: ' + error.message);
      }
    },
    getWallets: async () => {
      try {
        return await Wallet.find();
      } catch (error) {
        throw new Error('Error fetching wallets');
      }
    },
    getCategories: async () => {
      try {
        return await Category.find();
      } catch (error) {
        throw new Error('Error fetching categories');
      }
    },
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      try {
        const existingUser = await User.findOne({
          $or: [{ email }, { username }],
        });

        if (existingUser) {
          throw new Error('User with this email or username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          username,
          email,
          password: hashedPassword,
        });

        const savedUser = await user.save();

        const wallet = new Wallet({
          user: savedUser._id,
          amount: 0,
        });
        await wallet.save();

        return savedUser;
      } catch (error) {
        console.error('Create User Error:', error);
        throw new Error(error.message || 'Error creating user');
      }
    },
    createTransaction: async (
      _,
      {
        title,
        amount,
        type,
        category,
        paidBy,
        splits,
        description,
        transactionDate,
        user,
      }
    ) => {
      try {
        const paidById = new mongoose.Types.ObjectId(paidBy);
        const userId = new mongoose.Types.ObjectId(user);

        const [paidByUser, transactionUser] = await Promise.all([
          User.findById(paidById),
          User.findById(userId),
        ]);

        if (!paidByUser) {
          throw new Error('Paid by user not found');
        }
        if (!transactionUser) {
          throw new Error('Transaction user not found');
        }

        const splitUserIds = splits.map((split) => {
          const userId =
            typeof split.userId === 'object' ? split.userId._id : split.userId;
          return new mongoose.Types.ObjectId(userId);
        });

        const splitUsers = await User.find({ _id: { $in: splitUserIds } });

        if (splitUsers.length !== splitUserIds.length) {
          throw new Error('One or more split users not found');
        }

        const transaction = new Transaction({
          title,
          amount,
          type: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase(),
          category,
          paidBy: paidById,
          splits: splits.map((split) => {
            const userId =
              typeof split.userId === 'object'
                ? split.userId._id
                : split.userId;
            return {
              userId: new mongoose.Types.ObjectId(userId),
              percent: split.percent,
              value: split.value,
            };
          }),
          description,
          user: userId,
          transactionDate: transactionDate || new Date(),
          createdAt: new Date(),
        });
        const savedTransaction = await transaction.save();

        const populatedTransaction = await Transaction.findById(
          savedTransaction._id
        )
          .populate('paidBy')
          .populate('user')
          .populate('splits.userId');

        if (!populatedTransaction) {
          throw new Error('Failed to save transaction');
        }

        const transactionObj = populatedTransaction.toObject();

        return {
          ...transactionObj,
          id: transactionObj._id.toString(),
          paidBy: {
            id: transactionObj.paidBy._id.toString(),
            username: transactionObj.paidBy.username,
            email: transactionObj.paidBy.email,
          },
          user: {
            id: transactionObj.user._id.toString(),
            username: transactionObj.user.username,
            email: transactionObj.user.email,
          },
          splits: transactionObj.splits.map((split) => ({
            userId: split.userId._id.toString(),
            percent: split.percent,
            value: split.value,
          })),
        };
      } catch (error) {
        console.error('Create Transaction Error:', error);
        throw new Error(error.message || 'Error creating transaction');
      }
    },
    updateTransaction: async (
      _,
      { id, title, amount, type, category, paidBy, splits, description, user }
    ) => {
      try {
        const transaction = await Transaction.findByIdAndUpdate(
          id,
          {
            title,
            amount,
            type,
            category,
            paidBy,
            splits,
            description,
            user,
          },
          { new: true }
        );
        return transaction;
      } catch (error) {
        console.error('Update Transaction Error:', error);
        throw new Error('Error updating transaction');
      }
    },
    createCategory: async (_, { name }) => {
      try {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          throw new Error('Category with this name already exists');
        }

        const category = new Category({ name });
        return await category.save();
      } catch (error) {
        console.error('Create Category Error:', error);
        throw new Error(error.message || 'Error creating category');
      }
    },
    deleteTransaction: async (_, { id }) => {
      try {
        const transaction = await Transaction.findById(id)
          .populate('paidBy')
          .populate('user')
          .populate('splits.userId');

        if (!transaction) {
          throw new Error('Transaction not found');
        }

        const transactionObj = transaction.toObject();
        await Transaction.findByIdAndDelete(id);

        return {
          id: transactionObj._id.toString(),
          title: transactionObj.title,
          amount: transactionObj.amount,
          type: transactionObj.type,
          category: transactionObj.category,
          paidBy: {
            id: transactionObj.paidBy._id.toString(),
            username: transactionObj.paidBy.username,
            email: transactionObj.paidBy.email,
          },
          splits: transactionObj.splits.map((split) => ({
            userId: split.userId._id.toString(),
            percent: split.percent,
            value: split.value,
          })),
          description: transactionObj.description,
          createdAt: transactionObj.createdAt.toISOString(),
          user: {
            id: transactionObj.user._id.toString(),
            username: transactionObj.user.username,
            email: transactionObj.user.email,
          },
        };
      } catch (error) {
        console.error('Delete Transaction Error:', error);
        throw new Error(error.message || 'Error deleting transaction');
      }
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        token,
        user,
      };
    },
  },
};

module.exports = resolvers;
