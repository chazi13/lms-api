 
import { GraphQLScalarType } from 'graphql/type/definition';
import { GraphQLError } from 'graphql/error';
import { Kind } from 'graphql/language';

const PHONE_NUMBER_REGEX = /^\+[1-9]\d{1,14}$/;

export const PhoneNumberScalar = new GraphQLScalarType({
  name: 'PhoneNumber',

  description:
    'A field whose value conforms to the standard E.164 format as specified in: https://en.wikipedia.org/wiki/E.164. Basically this is +17895551234.',

  serialize(value) {
    if (typeof value !== 'string') {
      throw new TypeError(`Value is not string: ${value}`);
    }

    if (!(PHONE_NUMBER_REGEX.test(value))) {
      throw new TypeError(`Value is not a valid phone number of the form +17895551234 (10-15 digits): ${value}`);
    }

    return value;
  },

  parseValue(value) {
    if (typeof value !== 'string') {
      throw new TypeError(`Value is not string: ${value}`);
    }

    if (!(PHONE_NUMBER_REGEX.test(value))) {
      throw new TypeError(`Value is not a valid phone number of the form +17895551234 (10-15 digits): ${value}`);
    }

    return value;
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as phone numbers but got a: ${ast.kind}`,
      );
    }

    if (!(PHONE_NUMBER_REGEX.test(ast.value))) {
      throw new TypeError(`Value is not a valid phone number of the form +17895551234 (10-15 digits): ${ast.value}`);
    }

    return ast.value;
  },
});


/* eslint-disable no-useless-escape */
const EMAIL_ADDRESS_REGEX = new RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  );
  /* eslint-enable */
  
export const EmailAddressScalar = new GraphQLScalarType({
    name: 'EmailAddress',
  
    description:
      'A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.',
  
    serialize(value) {
      if (typeof value !== 'string') {
        throw new TypeError(`Value is not string: ${value}`);
      }
  
      if (!EMAIL_ADDRESS_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid email address: ${value}`);
      }
  
      return value;
    },
  
    parseValue(value) {
      if (typeof value !== 'string') {
        throw new TypeError('Value is not string');
      }
  
      if (!EMAIL_ADDRESS_REGEX.test(value)) {
        throw new TypeError(`Value is not a valid email address: ${value}`);
      }
  
      return value;
    },
  
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) {
        throw new GraphQLError(
          `Can only validate strings as email addresses but got a: ${ast.kind}`,
        );
      }
  
      if (!EMAIL_ADDRESS_REGEX.test(ast.value)) {
        throw new TypeError(`Value is not a valid email address: ${ast.value}`);
      }
  
      return ast.value;
    },
  });