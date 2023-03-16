/**
 * A model for the external authentication request.
 */
interface ExternalAuthDto {

    /**
     * The name provider of the external authentication.
     */
    provider: string;

    /**
     * The token that is returned from the external authentication.
     */
    idToken: string;
}

export default ExternalAuthDto;
