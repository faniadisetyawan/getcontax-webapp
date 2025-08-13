<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        @page {
            size: A4;
            margin: 0;
        }

        body {
            margin: 0;
            padding: 0;
        }

        table {
            border-collapse: collapse;
            width: 210mm;
            height: 297mm;
        }

        td {
            width: 32mm;
            height: 19mm;
            text-align: center;
            vertical-align: middle;
            padding: 1mm;
            box-sizing: border-box;
            border: 1px dashed #ccc;
        }

        .label-name {
            font-size: 6pt;
            font-weight: bold;
            line-height: 1.1;
        }

        .label-price {
            font-size: 6pt;
            line-height: 1.1;
        }

        .barcode {
            max-width: 100%;
            height: auto;
        }
    </style>
</head>

<body>
    <table>
        @php
            $cols = 6; 
        @endphp

        @for ($i = 0; $i < $quantity; $i++)
            @if ($i % $cols == 0)
                <tr>
            @endif

            <td>
                <div class="label-name">{{ $product->name }}</div>
                <img class="barcode"
                    src="data:image/png;base64,{{ DNS1D::getBarcodePNG($product->sku ?? $product->barcode, 'C128', 1, 20) }}" />
                <div class="label-price">Rp {{ number_format($product->price, 0, ',', '.') }}</div>
            </td>

            @if (($i + 1) % $cols == 0 || $i + 1 == $quantity)
                </tr>
            @endif
        @endfor
    </table>
</body>

</html>
