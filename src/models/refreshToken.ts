import { Schema, model } from "mongoose";

interface TRefreshToken {
  tokens: string[];
}

const refreshTokenSchema = new Schema<TRefreshToken>({
  tokens: [String],
});

const RefreshTokenModel = model<TRefreshToken>(
  "RefreshTokenModel",
  refreshTokenSchema
);

export const getRefreshTokens = async () => {
  const data = await RefreshTokenModel.find();
  let tokenCollection;

  if (data.length > 1) {
    await RefreshTokenModel.deleteMany({});
    tokenCollection = await RefreshTokenModel.create({ tokens: [] });
  } else if (data.length === 1) {
    tokenCollection = data[0];
  } else {
    tokenCollection = await RefreshTokenModel.create({ tokens: [] });
  }

  return tokenCollection;
};

export const addRefreshToken = async (token: string) => {
  const { _id, tokens } = await getRefreshTokens();
  if (tokens.includes(token)) return;
  return await RefreshTokenModel.findByIdAndUpdate(_id, {
    tokens: [...tokens, token],
  });
};

export const deleteRefreshToken = async (token: string) => {
  const { _id, tokens } = await getRefreshTokens();
  if (!tokens.includes(token)) return;
  return await RefreshTokenModel.findByIdAndUpdate(_id, {
    tokens: tokens.filter((t) => t !== token),
  });
};

export default RefreshTokenModel;
