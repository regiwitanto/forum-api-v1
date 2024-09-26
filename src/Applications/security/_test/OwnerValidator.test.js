const OwnerValidator = require('../OwnerValidator');

describe('OwnerValidator interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const ownerValidator = new OwnerValidator();

    await expect(ownerValidator.verifyOwner('', '', '')).rejects.toThrowError(
      'OWNER_VALIDATOR.METHOD_NOT_IMPLEMENTED'
    );
  });
});
