/**
 * @swagger
 *
 * definitions:
 *   NewItem:
 *     type: object
 *     required:
 *       - text
 *       - done
 *     properties:
 *       text:
 *         type: string
 *       done:
 *         type: boolean
 *   Item:
 *     type: object
 *     required:
 *       - id
 *       - text
 *       - done
 *     properties:
 *       id:
 *         type: integer
 *       text:
 *         type: string
 *       done:
 *         type: boolean
 *   Items:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Item'
 *   Page:
 *     type: object
 *     required:
 *       - id
 *       - items
 *     properties:
 *       id:
 *         type: integer
 *       items:
 *         type: array
 *         $ref: '#/definitions/Items'
 *   Pages:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Page'
 */
