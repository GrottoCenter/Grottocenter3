import fetch from 'isomorphic-fetch';
import { identificationTokenName, postDocumentUrl } from '../conf/Config';

// ==========
export const POST_DOCUMENT = 'POST_DOCUMENT';
export const POST_DOCUMENT_SUCCESS = 'POST_DOCUMENT_SUCCESS';
export const POST_DOCUMENT_FAILURE = 'POST_DOCUMENT_FAILURE';

// ==========

export const postDocumentAction = () => ({
  type: POST_DOCUMENT,
});

export const postDocumentSuccess = (httpCode) => ({
  type: POST_DOCUMENT_SUCCESS,
  httpCode,
});

export const postDocumentFailure = (errorMessages, httpCode) => ({
  type: POST_DOCUMENT_FAILURE,
  errorMessages,
  httpCode,
});

export function postDocument(docAttributes) {
  return (dispatch) => {
    dispatch(postDocumentAction());

    const authToken = window.localStorage.getItem(identificationTokenName);
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ ...docAttributes, token: authToken }),
    };

    return fetch(postDocumentUrl, requestOptions).then((response) => {
      return response.text().then((responseText) => {
        if (response.status >= 400) {
          const errorMessages = [];
          switch (response.status) {
            case 400:
              errorMessages.push(`Bad request: ${responseText}`);
              break;
            case 401:
              errorMessages.push(
                'You must be authenticated to post a document.',
              );
              break;
            case 403:
              errorMessages.push(
                'You are not authorized to create a document.',
              );
              break;
            case 404:
              errorMessages.push(
                'Server-side creation of the document is not available.',
              );
              break;
            case 500:
              errorMessages.push(
                'A server error occurred, please try again later or contact Wikicaves for more information.',
              );
              break;
            default:
              break;
          }
          dispatch(postDocumentFailure(errorMessages, response.status));
          throw new Error(
            `Fetching ${postDocumentUrl} status: ${response.status}`,
            errorMessages,
          );
        } else {
          dispatch(postDocumentSuccess(response.status));
        }
        return response;
      });
    });
  };
}
